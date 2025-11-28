'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function BlackFridayMini() {
  const { locale } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isSaleEnded, setIsSaleEnded] = useState(false)

  useEffect(() => {
    // Sale start: Nov 26th, 2025 at 00:00:00 UAE time (UTC+4) = Nov 25th, 2025 at 20:00:00 UTC
    const saleStartDate = new Date('2025-11-25T20:00:00Z').getTime()
    // Sale end: Nov 28th, 2025 at 23:59:59 UAE time (UTC+4) = Nov 28th, 2025 at 19:59:59 UTC
    const saleEndDate = new Date('2025-11-28T19:59:59Z').getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()

      if (now >= saleEndDate) {
        setIsSaleEnded(true)
        return null
      }

      if (now >= saleStartDate) {
        const difference = saleEndDate - now
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        }
      }

      const difference = saleStartDate - now
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      if (newTimeLeft) {
        // Check if countdown has reached zero
        if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
          setIsSaleEnded(true)
          setTimeLeft(null)
          clearInterval(timer)
        } else {
          setTimeLeft(newTimeLeft)
        }
      } else {
        setIsSaleEnded(true)
        setTimeLeft(null)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isSaleEnded || !timeLeft) {
    return null
  }

  const formatTime = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium shadow-sm">
      <span className="font-semibold">{locale === 'ar' ? 'الجمعة السوداء' : 'Black Friday'}</span>
      <span>🔥</span>
      <span className="font-bold text-red-500">-20%</span>
      <span className="text-gray-300">|</span>
      <span className="tabular-nums text-gray-600">
        {formatTime(timeLeft.days)}:{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    </div>
  )
}

