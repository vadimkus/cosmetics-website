import { NextResponse } from 'next/server'
import { getDatabaseHealth } from '@/lib/database'

export async function GET() {
  try {
    const dbHealth = await getDatabaseHealth()
    
    const health = {
      status: dbHealth.status === 'healthy' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        api: { status: 'healthy', timestamp: new Date().toISOString() }
      }
    }
    
    return NextResponse.json(health, {
      status: health.status === 'ok' ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
