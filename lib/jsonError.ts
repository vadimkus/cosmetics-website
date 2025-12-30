import { NextResponse } from 'next/server'
import { errorLog } from '@/lib/logger'

export function jsonError(scope: string, error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error)
  errorLog(`[${scope}]`, error)
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? message : undefined,
    },
    { status }
  )
}



