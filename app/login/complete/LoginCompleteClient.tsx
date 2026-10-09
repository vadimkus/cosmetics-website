'use client'

import { useEffect, useState } from 'react'
import { isSafeReturnPath } from '@/lib/loginReturn'

function targetFromLocation(): string {
  const to = new URLSearchParams(window.location.search).get('to')
  return isSafeReturnPath(to) ? to : '/products'
}

export default function LoginCompleteClient() {
  const [target, setTarget] = useState('/products')

  useEffect(() => {
    const to = targetFromLocation()
    setTarget(to)
    window.location.replace(to)
  }, [])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      <a href={target} className="text-sm text-gray-600 underline">
        Continue
      </a>
    </main>
  )
}
