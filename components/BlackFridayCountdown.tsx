'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function BlackFridayCountdown() {
  const { locale, dir } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isSaleEnded, setIsSaleEnded] = useState(false)
  const [isSaleActive, setIsSaleActive] = useState(false)

  useEffect(() => {
    // Sale start: Nov 26th, 2025 at 00:00:00 UAE time (UTC+4) = Nov 25th, 2025 at 20:00:00 UTC
    const saleStartDate = new Date('2025-11-25T20:00:00Z').getTime()
    // Sale end: Nov 28th, 2025 at 23:59:59 UAE time (UTC+4) = Nov 28th, 2025 at 19:59:59 UTC
    const saleEndDate = new Date('2025-11-28T19:59:59Z').getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()

      // If sale has ended, hide timer
      if (now >= saleEndDate) {
        setIsSaleEnded(true)
        return null
      }

      // If sale has started, countdown to end
      if (now >= saleStartDate) {
        setIsSaleActive(true)
        const difference = saleEndDate - now

        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        }
      }

      // Before sale starts, countdown to start
      setIsSaleActive(false)
      const difference = saleStartDate - now

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
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

  // Don't show if sale has ended
  if (isSaleEnded || !timeLeft) {
    return null
  }

  return (
    <div className={`mt-6 md:mt-8 max-w-2xl mx-auto px-2 sm:px-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
      <div className="bg-white border-2 border-gray-300 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg">
        {/* Title */}
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-1.5 sm:mb-2 break-words">
            {locale === 'ar' ? (
              <>عرض الجمعة السوداء — <span className="text-red-500">خصم 20%</span></>
            ) : (
              <>Black Friday <span className="text-red-500">20% OFF</span></>
            )}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold break-words">
            {locale === 'ar' ? '26 نوفمبر — 28 نوفمبر' : 'Nov 26th — Nov 28th'}
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-4 mb-3 sm:mb-4 flex-wrap">
          {/* Days */}
          <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-300 min-w-[55px] sm:min-w-[60px] md:min-w-[80px] flex-shrink-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 tabular-nums leading-tight">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
              {locale === 'ar' ? 'يوم' : 'Days'}
            </div>
          </div>

          {/* Separator */}
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 leading-none">:</div>

          {/* Hours */}
          <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-300 min-w-[55px] sm:min-w-[60px] md:min-w-[80px] flex-shrink-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 tabular-nums leading-tight">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
              {locale === 'ar' ? 'ساعة' : 'Hours'}
            </div>
          </div>

          {/* Separator */}
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 leading-none">:</div>

          {/* Minutes */}
          <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-300 min-w-[55px] sm:min-w-[60px] md:min-w-[80px] flex-shrink-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 tabular-nums leading-tight">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
              {locale === 'ar' ? 'دقيقة' : 'Minutes'}
            </div>
          </div>

          {/* Separator */}
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 leading-none">:</div>

          {/* Seconds */}
          <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-300 min-w-[55px] sm:min-w-[60px] md:min-w-[80px] flex-shrink-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 tabular-nums leading-tight">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
              {locale === 'ar' ? 'ثانية' : 'Seconds'}
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center text-xs sm:text-sm md:text-base text-gray-700 break-words px-2">
          {isSaleActive 
            ? (locale === 'ar' 
                ? <>العرض جاري! لا يوجد حد أدنى للإنفاق. <Link href={getLocalizedPath('/blog/black-friday-sale-20-off', locale)} className="underline hover:text-red-500 transition-colors">جميع الطلبات مؤهلة.</Link></>
                : <>Sale is on! No minimum spend. <Link href={getLocalizedPath('/blog/black-friday-sale-20-off', locale)} className="underline hover:text-red-500 transition-colors">All orders qualify.</Link></>)
            : (locale === 'ar' 
                ? <>لا يوجد حد أدنى للإنفاق. <Link href={getLocalizedPath('/blog/black-friday-sale-20-off', locale)} className="underline hover:text-red-500 transition-colors">جميع الطلبات مؤهلة.</Link></>
                : <>No minimum spend. <Link href={getLocalizedPath('/blog/black-friday-sale-20-off', locale)} className="underline hover:text-red-500 transition-colors">All orders qualify.</Link></>)}
        </p>
      </div>
    </div>
  )
}

